import React from 'react';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';

export const OrderScheduler = ({ selectedDate, onDateSelect }) => {
    const today = startOfDay(new Date());
    const minDate = addDays(today, 1); // Tomorrow
    const maxDate = addDays(today, 7); // 7 days from now

    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        if (isBefore(date, minDate) || isAfter(date, maxDate)) {
            // Invalid date, reset or ignore
            return;
        }
        onDateSelect(date);
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-brand-blue mb-2">Pre-order Schedule</h4>
                <p className="text-sm text-brand-text mb-4">
                    Orders are delivered starting from tomorrow. You can schedule up to 7 days in advance.
                </p>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Delivery Date</label>
                    <input
                        type="date"
                        min={format(minDate, 'yyyy-MM-dd')}
                        max={format(maxDate, 'yyyy-MM-dd')}
                        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                        onChange={handleDateChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all font-sans"
                    />
                </div>
            </div>

            {selectedDate && (
                <div className="text-center p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                    Scheduled for: <b>{format(selectedDate, 'EEEE, d MMMM yyyy')}</b>
                </div>
            )}
        </div>
    );
};
