package com.drakalabs.schoolmngsys.finance.api;

import com.drakalabs.schoolmngsys.finance.api.dto.*;
import com.drakalabs.schoolmngsys.finance.domain.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FinanceMapper {

    @Mapping(source = "classLevel.id", target = "classLevelId")
    @Mapping(source = "term.id", target = "termId")
    @Mapping(source = "academicYear.id", target = "academicYearId")
    FeeScheduleDto toDto(FeeSchedule feeSchedule);

    FeeItemDto toDto(FeeItem feeItem);

    @Mapping(source = "enrollment.id", target = "enrollmentId")
    @Mapping(source = "feeSchedule.id", target = "feeScheduleId")
    @Mapping(target = "outstandingBalance", expression = "java(invoice.getOutstandingBalance())")
    InvoiceDto toDto(Invoice invoice);

    @Mapping(source = "feeItem.description", target = "description")
    InvoiceLineDto toDto(InvoiceLine invoiceLine);

    @Mapping(source = "student.id", target = "studentId")
    PaymentDto toDto(Payment payment);
}
