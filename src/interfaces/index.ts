import { Optional } from "sequelize";

export interface CredentialAttributes {
  credential_id: number;
  type: string;
  user_login_id: string;
  secret: string | null;
  created_at: Date;
}

export interface CredentialCreationAttributes
  extends Optional<CredentialAttributes, "credential_id" | "created_at"> {}

export interface EnrollmentCount {
  course_id: number;
  student_count: string;
}

export interface TopicsCount {
  course_id: number;
  topic_count: string;
}

export interface EntryCount {
  course_id: number;
  entry_count: string;
}

export interface FlatEntry {
  entry_id: number;
  entry_content: string;
  entry_created_at: string;
  "Topic.topic_id": number;
  "Topic.topic_title": string;
}

export interface CourseAttributes {
  course_id: number;
  semester: string;
  course_code: string;
  course_name: string;
  course_created_at: Date;
}

export interface CourseCreationAttributes
  extends Optional<CourseAttributes, "course_id"> {}

export interface EnrollmentAttributes {
  user_id: number;
  course_id: number;
  enrollment_type: string;
  enrollment_state: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EnrollmentCreationAttributes extends EnrollmentAttributes {}

export interface EntryAttributes {
  entry_id: number;
  entry_content: string;
  entry_created_at: Date;
  entry_deleted_at: Date | null;
  entry_state: string;
  entry_parent_id: number | null;
  entry_posted_by_user_id: number;
  topic_id: number;
}

export interface EntryCreationAttributes
  extends Optional<
    EntryAttributes,
    "entry_id" | "entry_deleted_at" | "entry_parent_id"
  > {}

export interface LoginAttributes {
  user_id: number;
  user_login_id: string;
}

export interface LoginCreationAttributes extends LoginAttributes {}

export interface TopicAttributes {
  topic_id: number;
  topic_title: string;
  topic_content: string;
  topic_created_at: Date;
  topic_deleted_at?: Date | null;
  topic_state: string;
  course_id: number;
  topic_posted_by_user_id: number;
}

export interface TopicCreationAttributes
  extends Optional<TopicAttributes, "topic_id" | "topic_deleted_at"> {}

export interface UserAttributes {
  user_id: number;
  user_name: string;
  user_created_at: Date;
  user_deleted_at: Date | null;
  user_state: string;
}

// Attributes allowed on creation (user_id optional if auto-generated)
export interface UserCreationAttributes
  extends Optional<UserAttributes, "user_deleted_at"> {}
