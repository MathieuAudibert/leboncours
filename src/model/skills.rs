use sea_orm::entity::prelude::*;
use uuid::Uuid;
use rust_decimal::Decimal;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "skills")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,

    pub mentor_id: Uuid,

    #[sea_orm(column_type = "String(Some(100))")]
    pub title: String,

    #[sea_orm(column_type = "Text")]
    pub description: String,

    #[sea_orm(column_type = "Decimal(Some((10, 2)))")]
    pub price: Decimal,

    #[sea_orm(default_value=True)]
    pub is_active: bool,

    #[sea_orm(default_value = "CURRENT_TIMESTAMP")]
    pub created_at: DateTimeWithTimeZone,

    #[sea_orm(default_value = "CURRENT_TIMESTAMP")]
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::MentorId",
        to = "super::user::Column::Id",
        on_delete = "Cascade"
    )]
    Mentor,
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Mentor.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
