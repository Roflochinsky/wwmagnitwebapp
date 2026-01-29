import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define types for date range and objects
export interface DateRange {
    from: Date;
    to: Date;
}



interface FilterContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    selectedObject: string | null;
    setSelectedObject: (object: string | null) => void;
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
    // TODO: Initialize with a default object if needed,    // Simplified object selection (just name)
    const [selectedObject, setSelectedObject] = React.useState<string | null>(null);

    return (
        <FilterContext.Provider value={{ dateRange, setDateRange, selectedObject, setSelectedObject }}>
            {children}
        </FilterContext.Provider>
    );
};
