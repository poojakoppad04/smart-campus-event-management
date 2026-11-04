-- CreateTable
CREATE TABLE "STUDENT" (
    "student_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "department" VARCHAR(100),
    "year_of_study" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "phone" VARCHAR(20),

    CONSTRAINT "STUDENT_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "ORGANIZER" (
    "organizer_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "department" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ORGANIZER_pkey" PRIMARY KEY ("organizer_id")
);

-- CreateTable
CREATE TABLE "VENUE" (
    "venue_id" SERIAL NOT NULL,
    "venue_name" VARCHAR(150) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "availability_status" VARCHAR(20) DEFAULT 'Available',

    CONSTRAINT "VENUE_pkey" PRIMARY KEY ("venue_id")
);

-- CreateTable
CREATE TABLE "EVENT" (
    "event_id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "event_date" DATE NOT NULL,
    "start_time" TIME(0) NOT NULL,
    "end_time" TIME(0) NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "status" VARCHAR(20) DEFAULT 'Upcoming',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EVENT_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "REGISTRATION" (
    "registration_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) DEFAULT 'Registered',

    CONSTRAINT "REGISTRATION_pkey" PRIMARY KEY ("registration_id")
);

-- CreateTable
CREATE TABLE "FEEDBACK" (
    "feedback_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "feedback_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FEEDBACK_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "STUDENT_email_key" ON "STUDENT"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ORGANIZER_email_key" ON "ORGANIZER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VENUE_venue_name_key" ON "VENUE"("venue_name");

-- CreateIndex
CREATE INDEX "fk_event_organizer" ON "EVENT"("organizer_id");

-- CreateIndex
CREATE INDEX "fk_event_venue" ON "EVENT"("venue_id");

-- CreateIndex
CREATE INDEX "fk_registration_event" ON "REGISTRATION"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_event" ON "REGISTRATION"("student_id", "event_id");

-- CreateIndex
CREATE INDEX "fk_feedback_event" ON "FEEDBACK"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_event_feedback" ON "FEEDBACK"("student_id", "event_id");

-- AddForeignKey
ALTER TABLE "EVENT" ADD CONSTRAINT "EVENT_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "ORGANIZER"("organizer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVENT" ADD CONSTRAINT "EVENT_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "VENUE"("venue_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REGISTRATION" ADD CONSTRAINT "REGISTRATION_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "STUDENT"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REGISTRATION" ADD CONSTRAINT "REGISTRATION_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "EVENT"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEEDBACK" ADD CONSTRAINT "FEEDBACK_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "STUDENT"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FEEDBACK" ADD CONSTRAINT "FEEDBACK_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "EVENT"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
