package com.drakalabs.schoolmngsys.finance.service;

import com.drakalabs.schoolmngsys.enrollment.domain.Enrollment;
import com.drakalabs.schoolmngsys.enrollment.domain.EnrollmentStatus;
import com.drakalabs.schoolmngsys.enrollment.repository.EnrollmentRepository;
import com.drakalabs.schoolmngsys.finance.api.dto.BillingRunRequest;
import com.drakalabs.schoolmngsys.finance.domain.FeeSchedule;
import com.drakalabs.schoolmngsys.finance.domain.Invoice;
import com.drakalabs.schoolmngsys.finance.domain.InvoiceLine;
import com.drakalabs.schoolmngsys.finance.repository.FeeScheduleRepository;
import com.drakalabs.schoolmngsys.finance.repository.InvoiceRepository;
import com.drakalabs.schoolmngsys.shared.error.BusinessRuleException;
import com.drakalabs.schoolmngsys.shared.error.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final FeeScheduleRepository feeScheduleRepository;
    private final InvoiceRepository invoiceRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public int executeBillingRun(BillingRunRequest request) {
        FeeSchedule schedule = feeScheduleRepository
            .findByClassLevelIdAndTermIdAndAcademicYearId(
                request.classLevelId(), request.termId(), request.academicYearId()
            )
            .orElseThrow(() -> new ResourceNotFoundException("FeeSchedule", "level/term/year"));

        if (!"APPROVED".equals(schedule.getStatus()) && !"PUBLISHED".equals(schedule.getStatus())) {
            throw new BusinessRuleException("BR-FI-001", "Cannot bill on a DRAFT fee schedule.");
        }

        List<Enrollment> activeEnrollments = enrollmentRepository
            .findAllBySchoolClassClassLevelIdAndAcademicYearIdAndStatus(
                request.classLevelId(), request.academicYearId(), EnrollmentStatus.ACTIVE
            );

        int generatedCount = 0;
        for (Enrollment enrollment : activeEnrollments) {
            boolean invoiceExists = invoiceRepository
                .findByEnrollmentIdAndFeeScheduleId(enrollment.getId(), schedule.getId())
                .isPresent();

            if (!invoiceExists) {
                Invoice invoice = Invoice.create(enrollment, schedule, request.issueDate(), request.dueDate());
                
                // Add mandatory lines
                schedule.getItems().stream()
                    .filter(item -> item.isMandatory())
                    .forEach(item -> {
                        invoice.addLine(InvoiceLine.create(item, item.getAmount()));
                    });
                
                invoiceRepository.save(invoice);
                generatedCount++;
            }
        }
        
        schedule.publish();
        feeScheduleRepository.save(schedule);
        
        return generatedCount;
    }
}
