use serde::Serialize;
use utoipa::ToSchema;

#[derive(Debug, Serialize, ToSchema)]
pub struct PaginatedResponse<T: Serialize> {
    pub data: Vec<T>,
    pub total: u64,
    pub page: u64,
    pub per_page: u64,
}

impl<T: Serialize> PaginatedResponse<T> {
    pub fn new(data: Vec<T>, page: u64, per_page: u64, total: u64) -> Self {
        Self {
            data,
            total,
            page,
            per_page,
        }
    }
}

pub trait Paginate {
    fn page(&self) -> u64;
    fn per_page(&self) -> u64;
}