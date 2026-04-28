CREATE TABLE IF NOT EXISTS saved_jobs (
  user_id   VARCHAR(36) NOT NULL,
  job_id    VARCHAR(36) NOT NULL,
  saved_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, job_id),
  INDEX idx_user_id (user_id),
  INDEX idx_job_id  (job_id)
);
