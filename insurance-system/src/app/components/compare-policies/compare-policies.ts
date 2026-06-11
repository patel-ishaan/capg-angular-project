import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../services/policy/policy-service';

@Component({
  selector:'app-compare-policies',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./compare-policies.html',
  styleUrl:'./compare-policies.css'
})
export class ComparePoliciesComponent implements OnInit {

  testMessage = 'NAVNEET COMPONENT';
  
  policies:any[]=[];

  selectedPolicy1:any=null;
  selectedPolicy2:any=null;

  constructor(private policyService:PolicyService){}

  ngOnInit() {

    console.log("COMPARE PAGE LOADED");

    this.policyService.getPolicies()
    .subscribe({
      next: (data) => {

        console.log("API RESPONSE:", data);

        this.policies = data;

        this.selectedPolicy1 = data[0];
        this.selectedPolicy2 = data[1];

      },

      error: (err) => {
        console.error("API ERROR:", err);
      }
    });
  }

}