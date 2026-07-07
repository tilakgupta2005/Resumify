CREATE OR REPLACE FUNCTION save_resume(
    p_user_id UUID,
    p_resume JSONB
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    exp JSONB;
    edu JSONB;
    proj JSONB;
    cert JSONB;
    item TEXT;
BEGIN

    -- Personal Info
    INSERT INTO personal_info (
        user_id,
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        linkedin,
        github,
        portfolio
    )
    VALUES (
        p_user_id,
        p_resume->'personal_info'->'name'->>'first_name',
        p_resume->'personal_info'->'name'->>'middle_name',
        p_resume->'personal_info'->'name'->>'last_name',
        p_resume->'personal_info'->>'email',
        p_resume->'personal_info'->>'phone',
        p_resume->'personal_info'->>'linkedin',
        p_resume->'personal_info'->>'github',
        p_resume->'personal_info'->>'portfolio'
    )
    ON CONFLICT (email)
    DO UPDATE SET
        first_name = EXCLUDED.first_name,
        middle_name = EXCLUDED.middle_name,
        last_name = EXCLUDED.last_name,
        phone = EXCLUDED.phone,
        linkedin = EXCLUDED.linkedin,
        github = EXCLUDED.github,
        portfolio = EXCLUDED.portfolio;

    -- Location
    DELETE FROM locations WHERE user_id = p_user_id;

    INSERT INTO locations (
        user_id,
        address,
        city,
        state,
        country,
        postal_code
    )
    VALUES (
        p_user_id,
        p_resume->'personal_info'->'location'->>'address',
        p_resume->'personal_info'->'location'->>'city',
        p_resume->'personal_info'->'location'->>'state',
        p_resume->'personal_info'->'location'->>'country',
        p_resume->'personal_info'->'location'->>'postal_code'
    );

    -- Clear old data
    DELETE FROM experience WHERE user_id = p_user_id;
    DELETE FROM education WHERE user_id = p_user_id;
    DELETE FROM projects WHERE user_id = p_user_id;
    DELETE FROM certifications WHERE user_id = p_user_id;
    DELETE FROM technical_participation WHERE user_id = p_user_id;
    DELETE FROM co_curricular WHERE user_id = p_user_id;
    DELETE FROM extra_curricular WHERE user_id = p_user_id;
    DELETE FROM achievements WHERE user_id = p_user_id;
    DELETE FROM skills WHERE user_id = p_user_id;

    -- Skills
    INSERT INTO skills(user_id, skills)
    VALUES (
        p_user_id,
        ARRAY(
            SELECT jsonb_array_elements_text(
                p_resume->'skills'
            )
        )
    );

    -- Experience
    FOR exp IN
        SELECT * FROM jsonb_array_elements(p_resume->'experience')
    LOOP
        INSERT INTO experience(
            user_id,
            company_name,
            designation,
            ctc,
            location,
            start_date,
            end_date,
            skills
        )
        VALUES (
            p_user_id,
            exp->>'company',
            exp->>'designation',
            (exp->>'ctc')::numeric,
            exp->>'location',
            (exp->>'start_date')::date,
            NULLIF(exp->>'end_date','')::date,
            ARRAY(
                SELECT jsonb_array_elements_text(exp->'skills')
            )
        );
    END LOOP;

    -- Education
    FOR edu IN
        SELECT * FROM jsonb_array_elements(p_resume->'education')
    LOOP
        INSERT INTO education(
            user_id,
            institution_name,
            degree,
            field_of_study,
            start_date,
            end_date,
            grade
        )
        VALUES (
            p_user_id,
            edu->>'institution_name',
            edu->>'degree',
            edu->>'field_of_study',
            (edu->>'start_date')::date,
            NULLIF(edu->>'end_date','')::date,
            edu->>'grade'
        );
    END LOOP;

    -- Projects
    FOR proj IN
        SELECT * FROM jsonb_array_elements(p_resume->'projects')
    LOOP
        INSERT INTO projects(
            user_id,
            project_name,
            team_size,
            start_date,
            end_date,
            project_url,
            technologies_used,
            description,
            embedding
        )
        VALUES (
            p_user_id,
            proj->>'project_name',
            (proj->>'team_size')::int,
            (proj->>'start_date')::date,
            NULLIF(proj->>'end_date','')::date,
            proj->>'project_url',
            ARRAY(
                SELECT jsonb_array_elements_text(
                    proj->'technologies_used'
                )
            ),
            proj->>'description',
            (proj->>'embedding')::vector -- Assuming embedding is stored as a JSON array of floats
        );
    END LOOP;

    -- Certifications
    FOR cert IN
        SELECT * FROM jsonb_array_elements(p_resume->'certifications')
    LOOP
        INSERT INTO certifications(
            user_id,
            title,
            issuing_organization,
            issue_date,
            skills
        )
        VALUES (
            p_user_id,
            cert->>'title',
            cert->>'issuing_organization',
            (cert->>'issue_date')::date,
            ARRAY(
                SELECT jsonb_array_elements_text(
                    cert->'skills'
                )
            )
        );
    END LOOP;

    -- Technical Participation
    FOR item IN
        SELECT jsonb_array_elements_text(
            p_resume->'technical_participation'
        )
    LOOP
        INSERT INTO technical_participation(
            user_id,
            technical_participation
        )
        VALUES (p_user_id, item);
    END LOOP;

    -- Co-Curricular
    FOR item IN
        SELECT jsonb_array_elements_text(
            p_resume->'co_curricular'
        )
    LOOP
        INSERT INTO co_curricular(
            user_id,
            co_curricular
        )
        VALUES (p_user_id, item);
    END LOOP;

    -- Extra-Curricular
    FOR item IN
        SELECT jsonb_array_elements_text(
            p_resume->'extra_curricular'
        )
    LOOP
        INSERT INTO extra_curricular(
            user_id,
            extra_curricular
        )
        VALUES (p_user_id, item);
    END LOOP;

    -- Achievements
    FOR item IN
        SELECT jsonb_array_elements_text(
            p_resume->'achievements'
        )
    LOOP
        INSERT INTO achievements(
            user_id,
            achievements
        )
        VALUES (p_user_id, item);
    END LOOP;

END;
$$;