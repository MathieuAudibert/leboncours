use crate::api::error::ApiError;

pub fn hash_password(password: &str) -> Result<String, ApiError> {
    use argon2::{
        password_hash::{rand_core::OsRng, SaltString},
        Argon2, PasswordHasher,
    };

    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|e| ApiError::InternalError(format!("Password hash error: {}", e)))
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool, ApiError> {
    use argon2::{password_hash::PasswordHash, Argon2, PasswordVerifier};

    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| ApiError::InternalError(format!("Invalid hash: {}", e)))?;

    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}