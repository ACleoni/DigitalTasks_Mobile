CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL , 
    "email" VARCHAR(255) NOT NULL, 
    "password" VARCHAR(255) NOT NULL, 
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false, 
    "confirmationEmailToken" VARCHAR(255) NOT NULL, 
    "confirmationEmailExpirationDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2018-08-30 07:45:28.025 +00:00', 
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
    UNIQUE ("email"), 
    PRIMARY KEY ("id"));