use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

// UsersRole
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, PartialEq, Eq)]
pub enum UsersRole {
    Teacher,
    Student,
    Admin,
}

impl From<String> for UsersRole {
    fn from(s: String) -> Self {
        match s.as_str() {
            "Teacher" => UsersRole::Teacher,
            "Admin" => UsersRole::Admin,
            _ => UsersRole::Student,
        }
    }
}

impl From<UsersRole> for String {
    fn from(role: UsersRole) -> Self {
        match role {
            UsersRole::Teacher => "Teacher".to_string(),
            UsersRole::Student => "Student".to_string(),
            UsersRole::Admin => "Admin".to_string(),
        }
    }
}

// EventState
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, PartialEq, Eq, Default)]
pub enum EventState {
    #[default]
    Pending,
    Confirmed,
    Cancelled,
    Done,
}

impl From<String> for EventState {
    fn from(s: String) -> Self {
        match s.as_str() {
            "Confirmed" => EventState::Confirmed,
            "Cancelled" => EventState::Cancelled,
            "Done" => EventState::Done,
            _ => EventState::Pending,
        }
    }
}

impl From<EventState> for String {
    fn from(state: EventState) -> Self {
        match state {
            EventState::Pending => "Pending".to_string(),
            EventState::Confirmed => "Confirmed".to_string(),
            EventState::Cancelled => "Cancelled".to_string(),
            EventState::Done => "Done".to_string(),
        }
    }
}