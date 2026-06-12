// src/app/services/policy-reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PolicyReportsService {
  private apiUrl = 'http://localhost:3000';
  private pdfMake: any = null;

  constructor(private http: HttpClient) {
    this.loadPdfMake();
  }

  private async loadPdfMake() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default || pdfMakeModule;
    }
  }

  generatePolicyPdf(policyId: string): Observable<void> {
    const policy$ = this.http.get<any>(`${this.apiUrl}/policies/${policyId}`);
    const purchases$ = this.http.get<any[]>(`${this.apiUrl}/purchases?policyId=${policyId}`);

    return forkJoin({ policy: policy$, purchases: purchases$ }).pipe(
      switchMap(({ policy, purchases }) => {
        const purchaseIds = purchases.map((p) => p.id);
        return this.http.get<any[]>(`${this.apiUrl}/payments`).pipe(
          switchMap((allPayments) => {
            const matchedPayments = allPayments.filter((p) => purchaseIds.includes(p.purchaseId));
            return from(this.createAndDownloadPdf(policy, matchedPayments, purchases));
          }),
        );
      }),
    );
  }

  private async createAndDownloadPdf(
    policy: any,
    payments: any[],
    purchases?: any[],
  ): Promise<void> {
    await this.loadPdfMake();
    if (!this.pdfMake || typeof this.pdfMake.createPdf !== 'function') {
      throw new Error('pdfMake not initialized');
    }

    const totalPaid = payments
      .filter((p: any) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalDue = payments
      .filter((p: any) => p.status === 'due' || p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    const paymentRows = payments.map((p: any) => [
      p.purchaseId,
      new Date(p.dueDate).toLocaleDateString(),
      p.paidDate ? new Date(p.paidDate).toLocaleDateString() : 'Not paid',
      `₹ ${p.amount.toLocaleString()}`,
      p.status,
      p.paymentMethod || '-',
    ]);

    const documentDefinition: any = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      content: [
        { text: 'Insurance Policy Report', style: 'header' },
        { text: `Policy ID: ${policy.id}`, style: 'subheader', margin: [0, 10, 0, 5] },
        { text: policy.name, style: 'title' },
        { text: `Type: ${policy.type} | Term: ${policy.termYears} years`, margin: [0, 5, 0, 10] },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            body: [
              ['Coverage Amount', `₹ ${policy.coverageAmount.toLocaleString()}`],
              ['Annual Premium', `₹ ${policy.premiumAmount.toLocaleString()}`],
              ['Eligibility Age', `${policy.minAge} – ${policy.maxAge} years`],
              ['Status', policy.isActive ? 'Active' : 'Inactive'],
            ],
          },
          layout: 'lightHorizontalLines',
        },
        { text: 'Benefits', style: 'sectionHeader', margin: [0, 15, 0, 5] },
        { ul: policy.benefits },
        { text: 'Exclusions', style: 'sectionHeader', margin: [0, 15, 0, 5] },
        { ul: policy.exclusions },
        { text: 'Payment History', style: 'sectionHeader', margin: [0, 20, 0, 8] },
        {
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Purchase ID', 'Due Date', 'Paid Date', 'Amount', 'Status', 'Method'],
              ...paymentRows,
            ],
          },
          layout: 'lightHorizontalLines',
        },
        { text: 'Summary', style: 'sectionHeader', margin: [0, 15, 0, 5] },
        {
          ul: [
            `Total Payments: ${payments.length}`,
            `Total Paid Amount: ₹ ${totalPaid.toLocaleString()}`,
            `Total Outstanding: ₹ ${totalDue.toLocaleString()}`,
          ],
        },
        {
          text: `Report generated on ${new Date().toLocaleString()}`,
          style: 'footer',
          margin: [0, 30, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 15] },
        subheader: { fontSize: 12, bold: true, color: '#555' },
        title: { fontSize: 16, bold: true, margin: [0, 5, 0, 5] },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        tableExample: { margin: [0, 5, 0, 15] },
        footer: { fontSize: 9, italics: true, alignment: 'center' },
      },
    };

    this.pdfMake.createPdf(documentDefinition).download(`PolicyReport_${policy.id}.pdf`);
  }
}
