// Central curriculum data export
import { grade6Topics } from "./grade6";
import type { Topic, Lesson } from "./grade6";
import { grade7Topics } from "./grade7";
import { grade8Topics } from "./grade8";
import { grade9Topics } from "./grade9";
import { grade10Topics } from "./grade10";
import { grade11Topics } from "./grade11";
import { grade12Topics } from "./grade12";

export type { Topic, Lesson };

export interface GradeData {
    id: string;
    grade: number;
    level: "THCS" | "THPT";
    subject: string;
    topics: Topic[];
}

export const curriculumData: Record<string, GradeData> = {
    "6": {
        id: "6",
        grade: 6,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        topics: grade6Topics,
    },
    "7": {
        id: "7",
        grade: 7,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        topics: grade7Topics,
    },
    "8": {
        id: "8",
        grade: 8,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        topics: grade8Topics,
    },
    "9": {
        id: "9",
        grade: 9,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        topics: grade9Topics,
    },
    "10": {
        id: "10",
        grade: 10,
        level: "THPT",
        subject: "Hóa học",
        topics: grade10Topics,
    },
    "11": {
        id: "11",
        grade: 11,
        level: "THPT",
        subject: "Hóa học",
        topics: grade11Topics,
    },
    "12": {
        id: "12",
        grade: 12,
        level: "THPT",
        subject: "Hóa học",
        topics: grade12Topics,
    },
};

export const getGradeData = (gradeId: string): GradeData | undefined => {
    return curriculumData[gradeId];
};

export const getLessonById = (
    gradeId: string,
    lessonId: string
): { lesson: Lesson; topic: Topic; grade: GradeData } | undefined => {
    const grade = curriculumData[gradeId];
    if (!grade) return undefined;

    for (const topic of grade.topics) {
        const lesson = topic.lessons.find((l) => l.id === lessonId);
        if (lesson) {
            return { lesson, topic, grade };
        }
    }
    return undefined;
};
