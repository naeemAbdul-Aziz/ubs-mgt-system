package com.drakalabs.schoolmngsys.academics.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CalendarService {

    /**
     * Checks if a given date is a valid school day.
     * For MVP, this simply checks if it's a weekday.
     * In a full implementation, this would check against Terms and SchoolDayExceptions (holidays).
     */
    @Transactional(readOnly = true)
    public boolean isSchoolDay(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY;
    }
}
