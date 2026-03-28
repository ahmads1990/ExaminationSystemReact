import { ApiErrorCode } from '../api/contracts/apiErrorCode';

export const ErrorMessages: Record<ApiErrorCode, string> = {
    [ApiErrorCode.None]: "An unknown error occurred.",
    
    // Authentication & Authorization
    [ApiErrorCode.InvalidCredentials]: "Invalid email or password.",
    [ApiErrorCode.EmailNotVerified]: "Your email address is not verified yet.",
    [ApiErrorCode.EmailAlreadyExists]: "An account with this email already exists.",
    [ApiErrorCode.UsernameAlreadyExists]: "This username is already taken.",
    [ApiErrorCode.InvalidVerificationToken]: "The verification token is invalid or has expired.",
    [ApiErrorCode.ExpiredToken]: "Your session has expired. Please log in again.",
    [ApiErrorCode.Unauthorized]: "You must be logged in to perform this action.",
    [ApiErrorCode.Forbidden]: "You don't have permission to perform this action.",
    [ApiErrorCode.InvalidToken]: "The security token is invalid. Please log in again.",
    [ApiErrorCode.ExamTimeout]: "Your exam time has run out.",

    // Validation Errors
    [ApiErrorCode.ValidationFailed]: "Please check the form for validation errors.",

    // Resource Errors
    [ApiErrorCode.ResourceNotFound]: "The requested resource was not found.",
    [ApiErrorCode.CourseNotFound]: "The specified course could not be found.",
    [ApiErrorCode.ExamNotFound]: "The specified exam could not be found.",
    [ApiErrorCode.QuestionNotFound]: "The specified question could not be found.",
    [ApiErrorCode.StudentNotFound]: "The student account could not be found.",
    [ApiErrorCode.InstructorNotFound]: "The instructor account could not be found.",

    // Business Logic Errors
    [ApiErrorCode.AlreadyEnrolled]: "You are already enrolled in this course.",
    [ApiErrorCode.ExamNotPublished]: "This exam has not been published yet.",
    [ApiErrorCode.ExamDeadlinePassed]: "The deadline for this exam has already passed.",
    [ApiErrorCode.InsufficientPermissions]: "You do not have enough permissions to perform this action.",
    [ApiErrorCode.CannotDeleteCourseWithStudents]: "Cannot delete a course that has enrolled students.",
    [ApiErrorCode.CannotDeletePublishedExam]: "Cannot delete an exam that has already been published.",
    [ApiErrorCode.CannotUnenrollFromCourse]: "You cannot unenroll from this course at this time.",
    [ApiErrorCode.ExamAlreadyPublished]: "This exam is already published.",
    [ApiErrorCode.ExamAlreadyUnpublished]: "This exam is already unpublished.",
    [ApiErrorCode.ExamArchived]: "This exam has been archived and cannot be modified.",
    [ApiErrorCode.ExamHasNoQuestions]: "Cannot publish an exam that has no questions.",
    [ApiErrorCode.ScoresMismatch]: "The total sum of question scores does not match the exam total grade.",
    [ApiErrorCode.ExamHasSubmissions]: "This exam cannot be modified because students have already made submissions.",
    [ApiErrorCode.ExamIsPublished]: "Cannot perform this action because the exam is currently published.",
    [ApiErrorCode.QuestionLocked]: "This question is locked and cannot be modified or deleted.",
    [ApiErrorCode.NotEnrolledInCourse]: "You must be enrolled in the course to access this exam.",
    [ApiErrorCode.MaxAttemptsExceeded]: "You have already reached the maximum number of attempts for this exam.",
    [ApiErrorCode.AttemptAlreadyCompleted]: "This exam attempt has already been submitted.",
    [ApiErrorCode.HasActiveAttempt]: "You already have an active attempt for this exam.",
    [ApiErrorCode.AttemptNotCompleted]: "This attempt must be completed before it can be graded or reviewed.",
    [ApiErrorCode.GradingInProgress]: "Your exam is currently being graded. Please check back later.",

    // Server Errors
    [ApiErrorCode.InternalServerError]: "An internal server error occurred. Please try again later.",
    [ApiErrorCode.DatabaseError]: "A database error occurred. Please try again later.",
    [ApiErrorCode.EmailServiceError]: "Failed to send email. Please ensure your email is correct and try again.",
    [ApiErrorCode.CacheError]: "A caching service error occurred. Please try again later.",
};

export const getErrorMessage = (errorCode: ApiErrorCode): string => {
    return ErrorMessages[errorCode] || ErrorMessages[ApiErrorCode.None];
};
