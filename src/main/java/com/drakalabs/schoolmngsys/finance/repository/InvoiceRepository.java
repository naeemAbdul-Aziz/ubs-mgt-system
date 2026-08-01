package com.drakalabs.schoolmngsys.finance.repository;

import com.drakalabs.schoolmngsys.finance.domain.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    
    Optional<Invoice> findByEnrollmentIdAndFeeScheduleId(UUID enrollmentId, UUID feeScheduleId);
    
    // Finds all invoices for a student across all their enrollments
    @Query("SELECT i FROM Invoice i WHERE i.enrollment.student.id = :studentId ORDER BY i.issueDate ASC")
    List<Invoice> findAllByStudentIdOrderByIssueDateAsc(@Param("studentId") UUID studentId);
    
    // Finds outstanding invoices for a student (where paid amount < total amount - approved adjustments)
    @Query("SELECT i FROM Invoice i LEFT JOIN i.adjustments a ON a.status = 'APPROVED' " +
           "WHERE i.enrollment.student.id = :studentId " +
           "AND i.status IN ('ISSUED', 'PARTIAL') " +
           "GROUP BY i " +
           "HAVING i.paidAmount < (i.totalAmount - COALESCE(SUM(a.amount), 0)) " +
           "ORDER BY i.issueDate ASC")
    List<Invoice> findOutstandingInvoicesByStudentIdOrderByIssueDateAsc(@Param("studentId") UUID studentId);
}
