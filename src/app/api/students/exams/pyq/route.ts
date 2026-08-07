import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const subject = searchParams.get("subject");
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!subject || !type || !value) {
      return NextResponse.json(
        {
          success: false,
          message: "subject, type and value are required",
        },
        { status: 400 }
      );
    }

    console.log("Fetching PYQ exams with:", { subject, type, value });

    // FETCH FROM PYQ META + JOIN EXAMS
    const pyqExams = await prisma.pyq_exam_meta.findMany({
      where: {
        subject: {
          equals: subject,
         
        },

        categoryType: {
          equals: type,
          
        },

        category: {
          equals: value,
          
        },
      },

      include: {
        exams: true,
      },

      orderBy: {
        set_number: "asc",
      },
    });
    
    console.log("Found pyqExams:", pyqExams.length);
    
    // If no results, return empty array instead of error
    if (pyqExams.length === 0) {
      console.log("No PYQ exams found for the given criteria");
      return NextResponse.json({
        success: true,
        exams: [],
      });
    }

    // FORMAT RESPONSE
    const exams = pyqExams.map((item) => {
      // Check if exams relation exists
      if (!item.exams) {
        console.warn("Pyq exam meta has no associated exam:", {
          pyqExamId: item.id,
          examId: item.exam_id,
          subject: item.subject,
          categoryType: item.categoryType,
          category: item.category
        });
        return null;
      }
      
      return {
        exam_id: item.exams.exam_id,
        exam_title: item.exams.exam_title,
        exam_type: item.exams.exam_type,

        duration_minutes: item.exams.time_limit_minutes,

        question_count: item.exams.question_count,

        total_marks: Number(item.exams.total_marks),

        set_number: item.set_number,
      };
    }).filter((exam): exam is NonNullable<typeof exam> => exam !== null);

    console.log("Formatted exams:", exams.length);

    return NextResponse.json({
      success: true,
      exams,
    });
  } catch (error) {
    console.error("PYQ fetch error:", error);
    // Return more specific error info for debugging
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch PYQ exams",
        // Including error details for debugging (remove in production)
        // error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}