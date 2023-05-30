import "dotenv/config";
import validateEnv from "./utils/validate_env";
import App from "./app";

import AuthController from "./controllers/auth.controller";
import NotificationsController from "./controllers/notifications.controller";
import CourseController from "./controllers/course.controller";
import VideoController from "./controllers/video.controller";
import TeamController from "./controllers/team.controller";
import CourseModulesController from "./controllers/courseModule.controller";
import CourseTopicController from "./controllers/courseTopic.controller";
import WorksheetController from "./controllers/worksheet.controller";
import UserTopicProgress from "./controllers/userTopicProgress.controller";
import QuizController from "./controllers/quiz.controller";
import FaqCategoryController from "./controllers/faq_category.controller";
import FaqController from "./controllers/faq.controller";
import OrganizationController from "./controllers/organization.controller";
import ReflectiveQuizController from "./controllers/reflective_quiz.controller";
import MentorController from "./controllers/mentor.controller";
import StudentController from "./controllers/student.controller";
import AdminController from "./controllers/admin.controller";
import EvaluatorController from "./controllers/evulator.controller";
import QuizSurveyController from "./controllers/quiz_survey.controller";
import MentorCourseController from "./controllers/mentorCourse.controller";
import MentorAttachmentController from "./controllers/mentorAttachment.controller";
import MentorTopicProgressController from "./controllers/mentorTopicProgress.controller";
import SupportTicketController from "./controllers/supportTickets.controller";
import SupportTicketRepliesController from "./controllers/supportTicketsReplies.controller";
import QuizQuestionsController from "./controllers/quiz_questions.controller";
import ChallengeController from "./controllers/challenges.controller";
import UserController from "./controllers/user.controler";
import DashboardController from "./controllers/dashboard.controller";
import TranslationController from "./controllers/translation.controller";
import BadgeController from "./controllers/badge.controller";
import TutorialVideoController from "./controllers/tutorial_video.controller";
import ReportController from "./controllers/report.controller";
import CertificateDownloadController from "./controllers/ceritificate_download.controller";
import ChallengeResponsesController from "./controllers/challenge_response.controller";
import EvaluatorRatingController from "./controllers/evaluator_rating.controller";
import InstructionController from "./controllers/instructions.controller";
import EvaluationProcess from "./controllers/evaluation_process.controller";

// validating env variables
validateEnv();

try {
    // initializing app
    const app = new App([
        new AuthController,
        new NotificationsController,
        new CourseController,
        new CourseModulesController,
        new VideoController,
        new TeamController,
        new CourseTopicController,
        new WorksheetController,
        new UserTopicProgress,
        new QuizController,
        new FaqCategoryController,
        new FaqController,
        new OrganizationController,
        new ReflectiveQuizController,
        new MentorController,
        new AdminController,
        new StudentController,
        new EvaluatorController,
        new QuizSurveyController,
        new MentorCourseController,
        new MentorAttachmentController,
        new MentorTopicProgressController,
        new SupportTicketController,
        new SupportTicketRepliesController,
        new QuizQuestionsController,
        new ChallengeController,
        new ChallengeResponsesController,
        new SupportTicketRepliesController,
        new UserController,
        new DashboardController,
        new TranslationController,
        new BadgeController,
        new TutorialVideoController,
        new ReportController,
        new CertificateDownloadController,
        new EvaluatorRatingController,
        new InstructionController,
        new EvaluationProcess,
    ], Number(process.env.APP_PORT));
    // starting app
    app.listen();
} catch (error) {
    console.log(error);
}