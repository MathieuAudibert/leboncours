use sea_orm::entity::prelude::*;
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "user_role")]
pub enum UserRole {
    #[sea_orm(string_value = "student")]
    Student,
    
    #[sea_orm(string_value = "mentor")]
    Mentor,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,

    #[sea_orm(column_type = "String(Some(50))", unique)]
    pub username: String,

    #[sea_orm(column_type = "String(Some(255))", unique)]
    pub email: String,

    #[sea_orm(column_type = "String(Some(255))")]

    pub role: UserRole,

    #[sea_orm(column_type = "Text", nullable)]
    pub bio: Option<String>,

    #[sea_orm(default_value = "CURRENT_TIMESTAMP")]
    pub created_at: DateTimeWithTimeZone,

    #[sea_orm(default_value = "CURRENT_TIMESTAMP")]
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}