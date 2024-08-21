import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../core/model/user.model';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment2 } from '../../../../environment/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModule,
    RouterLink,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  users: UserModel[] = [];
  paginatedUsers: UserModel[] = [];
  filteredUsers: UserModel[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  hoveredRow: number | null = null;

  currentPage: number = 1;
  userPerPage: number = environment2.itemsPerPage ? environment2.itemsPerPage : 5;
  totalPages: number = 0;

  // user state
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  userId: string = '';

  constructor(
    private toaster: ToastrService,
    private jwtService: JwtDecoderService,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initializeUserState();
    this.getUsers();
  }

  initializeUserState() {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      this.isLoggedIn = true;
      this.isAdmin = this.jwtService.getIsAdminFromToken(token);
      this.userId = this.jwtService.getUserIdFromToken(token)!;
    }
    else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.userId = '';
      this.router.navigate(['/']);
    }
  }

  getUsers() {
    this.adminService.getUsers().subscribe(
      (response: UserModel[]) => {
        this.users = response;
        this.isLoading = false;
        this.filterUsers();
      },
      (error) => {
        console.log(error);
        this.toaster.error('Error getting users');
      }
    );
  }

  filterUsers() {
    if (this.searchTerm.trim() === '') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (user.isAdmin ? 'Admin' : 'User')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          (user.isBlocked ? 'blocked' : 'active')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    this.totalPages = Math.ceil(this.filteredUsers.length / this.userPerPage);
    this.currentPage = 1;
    this.applyPagination();
  }

  applyPagination() {
    const startIndex = (this.currentPage - 1) * this.userPerPage;
    const endIndex = startIndex + this.userPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }
  deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe(
      (response) => {
        if (response.success) {
          if(this.userId == id)
          {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            this.router.navigate(['/']);
          }
          this.getUsers();
          this.toaster.success('User deleted successfully');
        }
      },
      (error) => {
        console.log(error);
        this.toaster.error('Error deleting user');
      }
    );
  }

  upgradeToAdmin(id: string) {
    this.adminService.upgradeToAdmin(id).subscribe(
      (response) => {
        if (response.success) {
          this.getUsers();
          this.toaster.success('User upgraded to admin successfully');
        }
      },
      (error) => {
        console.log(error);
        this.toaster.error('Error upgrading user to admin');
      }
    );
  }

  downgradeToUser(id: string) {
    this.adminService.downgradeToUser(id).subscribe(
      (response) => {
        if (response.success) {
          this.getUsers();
          this.toaster.success('User downgraded to user successfully');
        }
      },
      (error) => {
        console.log(error);
        this.toaster.error('Error downgrading user to user');
      }
    );
  }

  blockUser(id: string) {
    this.adminService.blockUser(id).subscribe(
      (response) => {
        if (response.success) {
          if(this.userId == id)
          {
            this.router.navigate(['/']);
          }
          this.getUsers();
          this.toaster.success('User blocked successfully');
        }
      },
      (error) => {
        console.log(error);
        this.toaster.error('Error blocking user');
      }
    );
  }

  unblockUser(id: string) {
    this.adminService.unblockUser(id).subscribe(
      (response) => {
        if (response.success) {
          this.getUsers();
          this.toaster.success('User unblocked successfully');
        }
      },
      (error) => {
        console.log(error);
        this.toaster.error('Error unblocking user');
      }
    );
  }

  navigateToUser(id: string) {
    this.router.navigate(['/profile-view', id], { relativeTo: this.route });
  }
}
