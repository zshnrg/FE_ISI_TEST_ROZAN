import { User } from "./auth";

export interface Task {
    task_id: number;
    task_name: string;
    task_description: string;
    task_start_date: Date;
    task_end_date: Date;
    task_status: string;
    task_color: string;
    task_created_at: Date;
    project_id: number;
};

export interface AssignedTask extends Task {
    assigned_user: User[]
    project_name: string;
}

export const assignedTaskDummy: AssignedTask[] = [
    {
      task_id: 1,
      task_name: "Create a new project",
      task_description: "Create a new project for the team",
      task_start_date: new Date(),
      task_end_date: new Date(),
      task_status: "Not Started",
      task_color: "#B22222",
      task_created_at: new Date(),
      project_id: 1,
      project_name: "Project 1",
      assigned_user: [
        {
          user_id: "e3f9e9f4-d5d8-4ef0-9aab-df9f5e2b7f0c",
          user_email: "test@mail.com",
          user_full_name: "Test User",
          user_color: "#1A1A1A",
          user_code: "A1B2C3D4"
        }
      ]
    },
    {
      task_id: 2,
      task_name: "Design UI",
      task_description: "Design the user interface for the project",
      task_start_date: new Date(),
      task_end_date: new Date(),
      task_status: "On Progress",
      task_color: "#2B2B2B",
      task_created_at: new Date(),
      project_id: 1,
      project_name: "Project 1",
      assigned_user: [
        {
          user_id: "7c3a8e64-1234-4c9f-9b5f-qwqweqwdsaz1",
          user_email: "designer@mail.com",
          user_full_name: "UI Designer",
          user_color: "#2C2C2C",
          user_code: "E5F6G7H8"
        },
        {
          user_id: "7c3a8e64-1234-4c9f-9b5f-a2c3e1234567",
          user_email: "designer@mail.com",
          user_full_name: "UI Designer",
          user_color: "#2C2C2C",
          user_code: "E5F6G7H8"
        },
        {
          user_id: "7c3a8e64-1234-4c9f-9b5f-asdasdwqeeqd",
          user_email: "designer@mail.com",
          user_full_name: "UI Designer",
          user_color: "#2C2C2C",
          user_code: "E5F6G7H8"
        },
        {
          user_id: "7c3a8e64-asdw-4c9f-9b5f-a2c3e1234567",
          user_email: "designer@mail.com",
          user_full_name: "UI Designer",
          user_color: "#2C2C2C",
          user_code: "E5F6G7H8"
        },
        {
          user_id: "7c3a8e64-12qwe4c9f-9b5f-a2c3e1234567",
          user_email: "designer@mail.com",
          user_full_name: "UI Designer",
          user_color: "#2C2C2C",
          user_code: "E5F6G7H8"
        },
        {
          user_id: "7c3a8e64-1234-4c9f-9b5f-a2qwe1234567",
          user_email: "designer@mail.com",
          user_full_name: "UI Designer",
          user_color: "#2C2C2C",
          user_code: "E5F6G7H8"
        },
        {
          "user_id": "d1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6",
          "user_email": "ux@mail.com",
          "user_full_name": "UX Specialist",
          "user_color": "#3C3C3C",
          "user_code": "I9J0K1L2"
        }
      ]
    },
    {
      task_id: 3,
      task_name: "Develop API",
      task_description: "Develop the backend APIs for the project",
      task_start_date: new Date(),
      task_end_date: new Date(),
      task_status: "Done",
      task_color: "#4D4D4D",
      task_created_at: new Date(),
      project_id: 1,
      project_name: "Project 1",
      assigned_user: [
        {
          user_id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
          user_email: "developer@mail.com",
          user_full_name: "Backend Developer",
          user_color: "#4E4E4E",
          user_code: "M3N4O5P6"
        }
      ]
    },
    {
      task_id: 4,
      task_name: "Write documentation",
      task_description: "Prepare project documentation",
      task_start_date: new Date(),
      task_end_date: new Date(),
      task_status: "Reject",
      task_color: "#5E5E5E",
      task_created_at: new Date(),
      project_id: 1,
      project_name: "Project 1",
      assigned_user: [
        {
          user_id: "f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5u6",
          user_email: "docwriter@mail.com",
          user_full_name: "Documentation Writer",
          user_color: "#5F5F5F",
          user_code: "Q7R8S9T0"
        },
        {
          "user_id": "z1x2c3v4-b5n6-m7l8-k9j0-h1g2f3d4s5a6",
          "user_email": "techlead@mail.com",
          "user_full_name": "Tech Lead",
          "user_color": "#6A6A6A",
          "user_code": "U1V2W3X4"
        }
      ]
    }
  ]
  