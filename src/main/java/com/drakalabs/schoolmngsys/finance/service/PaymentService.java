package com.drakalabs.schoolmngsys.finance.service;

import com.drakalabs.schoolmngsys.finance.api.dto.PaymentRequest;
import com.drakalabs.schoolmngsys.finance.domain.Invoice;
import com.drakalabs.schoolmngsys.finance.domain.Payment;
import com.drakalabs.schoolmngsys.finance.domain.PaymentAllocation;
import com.drakalabs.schoolmngsys.finance.repository.InvoiceRepository;
import com.drakalabs.schoolmngsys.finance.repository.PaymentRepository;
import com.drakalabs.schoolmngsys.people.domain.Student;
import com.drakalabs.schoolmngsys.people.repository.StudentRepository;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public Payment recordPayment(PaymentRequest request) {
        Student student = studentRepository.findById(request.studentId())
            .orElseThrow(() -> new ResourceNotFoundException("Student", request.studentId().toString()));

        // Generate simple receipt number (in real app, use sequence)
        String receiptNumber = "REC-" + System.currentTimeMillis();

        Payment payment = Payment.record(
            student,
            receiptNumber,
            request.amount(),
            request.paymentDate(),
            request.paymentMethod(),
            request.reference()
        );

        BigDecimal remainingAmount = request.amount();

        // Oldest-first allocation (BR-FI-002)
        List<Invoice> outstandingInvoices = invoiceRepository
            .findOutstandingInvoicesByStudentIdOrderByIssueDateAsc(student.getId());

        for (Invoice invoice : outstandingInvoices) {
            if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal outstanding = invoice.getOutstandingBalance();
            BigDecimal amountToAllocate = remainingAmount.min(outstanding);

            PaymentAllocation allocation = PaymentAllocation.allocate(invoice, amountToAllocate);
            payment.addAllocation(allocation);
            invoice.recordPaymentAllocation(amountToAllocate);

            remainingAmount = remainingAmount.subtract(amountToAllocate);
        }

        if (remainingAmount.compareTo(BigDecimal.ZERO) > 0) {
            // Technically an overpayment. We could store this as unallocated credit, 
            // but for MVP we will throw an error to force exact payments.
            throw new BusinessRuleException("BR-FI-OVER", "Payment exceeds total outstanding balance. Unallocated: " + remainingAmount);
        }

        paymentRepository.save(payment);
        return payment;
    }
}
