CREATE TABLE personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio VARCHAR(255)
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20)
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}'
);

CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    designation VARCHAR(255),
    ctc DECIMAL(15, 2),
    location TEXT,
    start_date DATE,
    end_date DATE,
    skills TEXT[] DEFAULT '{}'
);

CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_name VARCHAR(255),
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    grade VARCHAR(50)  -- optional: GPA or percentage
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name VARCHAR(255),
    team_size INT,
    start_date DATE,
    end_date DATE,
    project_url TEXT,
    technologies_used TEXT[] DEFAULT '{}',
    description TEXT,
    embedding vector(384)
);

CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    issuing_organization VARCHAR(255),
    issue_date DATE,
    skills TEXT[] DEFAULT '{}'
);

CREATE TABLE technical_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    technical_participation TEXT
);

CREATE TABLE co_curricular (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    co_curricular TEXT
);
CREATE TABLE extra_curricular (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    extra_curricular TEXT
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievements TEXT
);