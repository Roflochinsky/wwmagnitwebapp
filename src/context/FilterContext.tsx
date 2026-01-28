import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define types for date range and objects
export interface DateRange {
    from: Date;
    to: Date;
}

export interface WorkObject {
    id: number;
    name: string;
}

interface FilterContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    selectedObject: WorkObject | null;
    setSelectedObject: (obj: WorkObject | null) => void;
}

// Default to last 7 days
const defaultDateRange: DateRange = {
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date()
};

export const FilterContext = createContext<FilterContextType>({
    dateRange: defaultDateRange,
    setDateRange: () => { },
    selectedObject: null,
    setSelectedObject: () => { }
});

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
    // TODO: Initialize with a default object if needed, or fetch first available
    const [selectedObject, setSelectedObject] = useState<WorkObject | null>(null);

    return (
        <FilterContext.Provider value={{ dateRange, setDateRange, selectedObject, setSelectedObject }}>
            {children}
        </FilterContext.Provider>
    );
};
