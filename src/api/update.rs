use crate::entities::model;
use sea_orm::{DatabaseConnection, EntityTrait};
use serde_json::{Value, json};

pub struct DbConfig<'a> {
    pub db: &'a DatabaseConnection,
    pub tables: &'a [String],
    pub fields: &'a [String],
}

pub async fn update_one(db_config: DbConfig<'_>) -> Value {
    
    if db_config.tables.is_empty() || db_config.fields.is_empty() {
        return json!({"statusCode": 400, "message": "tables or field cant be empty"});
    }

    json!({"statusCode": 200, "message": format!("updated {:?} in {:?}", db_config.fields, db_config.tables)})
}

pub async fn update_many(db_config: DbConfig<'_>) -> Value {

    if db_config.tables.is_empty() || db_config.fields.is_empty() {
        return json!({"statusCode": 400, "message": "tables or field cant be empty"});
    }

    match db_config.tables[0].as_str() {
        "skills" | "users" | "bookings" => {

            let result = model::Entity::update_many()
                .col_expr(
                    model::Column::FieldName,
                    Expr::value(new_value)
                )
                .filter(model::Column::Id.eq(some_id))
                .exec(db_config.db)
                .await;

            match result {
                Ok(res) => json!({"statusCode": 200, "message": format!("update {} rows", res.rows_affected)}),
            }
        }
    }
}
