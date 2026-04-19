/**
 * API Error Codes
 * Shared enum between frontend and backend for consistent error handling
 */
export enum ApiErrorCode
{
    None = 0,

    // Authentication & Authorization (1000-1999)
    InvalidCredentials = 1001,
    EmailNotVerified = 1002,
    EmailAlreadyExists = 1003,
    UsernameAlreadyExists = 1004,
    InvalidVerificationToken = 1005,
    ExpiredToken = 1006,
    Unauthorized = 1007,
    Forbidden = 1008,
    InvalidToken = 1009,
    ExamTimeout = 1010,

    // Validation Errors (2000-2999)
    ValidationFailed = 2000,

    // Resource Errors (3000-3999)
    ResourceNotFound = 3000,
    CourseNotFound = 3001,
    ExamNotFound = 3002,
    QuestionNotFound = 3003,
    StudentNotFound = 3004,
    InstructorNotFound = 3005,

    // Business Logic Errors (4000-4999)
    AlreadyEnrolled = 4001,
    ExamNotPublished = 4002,
    ExamDeadlinePassed = 4003,
    InsufficientPermissions = 4004,
    CannotDeleteCourseWithStudents = 4005,
    CannotDeletePublishedExam = 4006,
    CannotUnenrollFromCourse = 4007,
    ExamAlreadyPublished = 4008,
    ExamAlreadyUnpublished = 4009,
    ExamArchived = 4010,
    ExamHasNoQuestions = 4011,
    ScoresMismatch = 4012,
    ExamHasSubmissions = 4013,
    ExamIsPublished = 4014,
    QuestionLocked = 4015,
    NotEnrolledInCourse = 4016,
    MaxAttemptsExceeded = 4017,
    AttemptAlreadyCompleted = 4018,
    HasActiveAttempt = 4019,
    AttemptNotCompleted = 4020,
    GradingInProgress = 4021,

    // Server Errors (5000-5999)
    InternalServerError = 5000,
    DatabaseError = 5001,
    EmailServiceError = 5002,
    CacheError = 5003
}
