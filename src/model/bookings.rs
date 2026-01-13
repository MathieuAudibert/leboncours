use sea_orm::entity::prelude::*;
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "booking_status")]
pub enum BookingStatus {
    #[sea_orm(string_value = "pending")]
    Pending,

    #[sea_orm(string_value = "confirmed")]
    Confirmed,

    #[sea_orm(string_value = "cancelled")]
    Cancelled,

    #[sea_orm(string_value = "completed")]
    Completed,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "bookings")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,

    pub student_id: Uuid,

    pub skill_id: Uuid,

    pub scheduled_time: DateTimeWithTimeZone,

    pub status: BookingStatus,

    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

    #[sea_orm(default_value = "CURRENT_TIMESTAMP")]
    pub created_at: DateTimeWithTimeZone,

    #[sea_orm(default_value = "CURRENT_TIMESTAMP")]
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::users::Entity",
        from = "Column::StudentId",
        to = "super::users::Column::Id",
        on_delete = "Cascade"
    )]
    Student,
    
    #[sea_orm(
        belongs_to = "super::skills::Entity",
        from = "Column::SkillId",
        to = "super::skills::Column::Id",
        on_delete = "SetNull"
    )]
    Skill,
}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Student.def()
    }
}

impl Related<super::skills::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Skill.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
