export interface IPaginated<T> {
    data: T[];
    lastPage: number;
    totalRecords: number;
    currentPage: number;
    hasMorePages: boolean;
}