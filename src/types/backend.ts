export type BackendClient = {
    get<T>(url: string, config?: any): Promise<T>;
    post<T>(url: string, config?: any): Promise<T>;
    patch<T>(url: string, config?: any): Promise<T>;
    delete<T>(url: string, config?: any): Promise<T>;
};