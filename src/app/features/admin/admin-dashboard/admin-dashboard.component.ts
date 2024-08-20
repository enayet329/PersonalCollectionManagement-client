import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../core/model/user.model';
import { ToastrService } from 'ngx-toastr';
import { JwtDecoderService } from '../../../core/services/jwt-decoder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, NgbModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: UserModel[] = [];
  paginatedUsers: UserModel[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  // user state
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

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
    }
  }

  getUsers() {
    this.adminService.getUsers().subscribe(
      (response: UserModel[]) => {
        this.users = response;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.filterUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filterUsers() {
    if (this.searchTerm.trim() === '') {
      this.paginatedUsers = this.users;
    } else {
      this.paginatedUsers = this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (user.isAdmin ? 'Admin' : 'User').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (user.isBlocked ? 'Blocked' : 'Active').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.propaginateUser();
  }

  propaginateUser() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.paginatedUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.propaginateUser();
    }
  }

  deleteUser(id: string) {
    this.adminService.deleteUser(id).subscribe(
      (response) => {
        if (response.success) {
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