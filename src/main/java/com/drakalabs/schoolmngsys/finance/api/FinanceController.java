package com.drakalabs.schoolmngsys.finance.api;

import com.drakalabs.schoolmngsys.finance.api.dto.BillingRunRequest;
import com.drakalabs.schoolmngsys.finance.api.dto.InvoiceDto;
import com.drakalabs.schoolmngsys.finance.api.dto.PaymentDto;
import com.drakalabs.schoolmngsys.finance.api.dto.PaymentRequest;
import com.drakalabs.schoolmngsys.finance.domain.Payment;
import com.drakalabs.schoolmngsys.finance.repository.InvoiceRepository;
import com.drakalabs.schoolmngsys.finance.repository.PaymentRepository;
import com.drakalabs.schoolmngsys.finance.service.BillingService;
import com.drakalabs.schoolmngsys.finance.service.PaymentService;
import com.drakalabs.schoolmngsys.shared.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final BillingService billingService;
    private final PaymentService paymentService;
    private final FinanceMapper financeMapper;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    @PostMapping("/billing-run")
    public ResponseEntity<?> executeBillingRun(@Valid @RequestBody BillingRunRequest request) {
        int invoicesGenerated = billingService.executeBillingRun(request);
        return ResponseEntity.ok(Map.of("invoicesGenerated", invoicesGenerated));
    }

    @PostMapping("/payments")
    public ResponseEntity<PaymentDto> recordPayment(@Valid @RequestBody PaymentRequest request) {
        Payment payment = paymentService.recordPayment(request);
        PaymentDto paymentDto = financeMapper.toDto(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentDto);
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceDto>> getInvoices() {
        List<InvoiceDto> dtos = invoiceRepository.findAll().stream()
                .map(financeMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<PaymentDto>> getTransactions() {
        List<PaymentDto> dtos = paymentRepository.findAll().stream()
                .map(financeMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Student-scoped endpoint: returns only the invoices belonging to the
     * currently authenticated student (resolved from JWT personId).
     * Prevents cross-student data exposure.
     */
    @GetMapping("/my-invoices")
    public ResponseEntity<List<InvoiceDto>> getMyInvoices() {
        return SecurityUtils.getCurrentUser()
                .map(user -> {
                    UUID studentId = user.personId();
                    List<InvoiceDto> myInvoices = invoiceRepository.findAll().stream()
                            .filter(inv -> inv.getEnrollment() != null
                                    && inv.getEnrollment().getStudent() != null
                                    && studentId.equals(inv.getEnrollment().getStudent().getId()))
                            .map(financeMapper::toDto)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(myInvoices);
                })
                .orElse(ResponseEntity.status(401).build());
    }
}
