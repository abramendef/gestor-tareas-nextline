-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "comments" TEXT,
    "responsible" TEXT,
    "tags" TEXT,
    "userId" TEXT NOT NULL
);
