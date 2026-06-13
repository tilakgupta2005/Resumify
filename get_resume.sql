CREATE OR REPLACE FUNCTION get_resume(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    resume JSONB;
BEGIN

    resume := jsonb_build_object(

        /* ---------------- PERSONAL INFO ---------------- */
        'personal_info',
        (
            SELECT jsonb_build_object(
                'name', jsonb_build_object(
                    'first_name', pi.first_name,
                    'middle_name', pi.middle_name,
                    'last_name', pi.last_name
                ),
                'email', pi.email,
                'phone', pi.phone,
                'location', jsonb_build_object(
                    'address', l.address,
                    'city', l.city,
                    'state', l.state,
                    'country', l.country,
                    'postal_code', l.postal_code
                ),
                'linkedin', pi.linkedin,
                'github', pi.github,
                'portfolio', pi.portfolio
            )
            FROM personal_info pi
            LEFT JOIN locations l ON l.user_id = pi.user_id
            WHERE pi.user_id = p_user_id
            LIMIT 1
        ),

        /* ---------------- SKILLS ---------------- */
        'skills',
        (
            SELECT COALESCE(
                jsonb_agg(skl),
                '[]'::jsonb
            )
            FROM skills sk
            CROSS JOIN LATERAL unnest(sk.skills) AS skl
            WHERE sk.user_id = p_user_id
        ),

        /* ---------------- EXPERIENCE (ORDERED DESC) ---------------- */
        'experience',
        (
            SELECT COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'company', e.company_name,
                        'designation', e.designation,
                        'ctc', e.ctc,
                        'location', e.location,
                        'start_date', e.start_date,
                        'end_date', e.end_date,
                        'skills', e.skills
                    )
                    ORDER BY e.start_date DESC NULLS LAST
                ),
                '[]'::jsonb
            )
            FROM experience e
            WHERE e.user_id = p_user_id
        ),

        /* ---------------- EDUCATION (ORDERED DESC) ---------------- */
        'education',
        (
            SELECT COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'institution_name', ed.institution_name,
                        'degree', ed.degree,
                        'field_of_study', ed.field_of_study,
                        'start_date', ed.start_date,
                        'end_date', ed.end_date,
                        'grade', ed.grade
                    )
                    ORDER BY ed.start_date DESC NULLS LAST
                ),
                '[]'::jsonb
            )
            FROM education ed
            WHERE ed.user_id = p_user_id
        ),

        /* ---------------- PROJECTS (ORDERED DESC) ---------------- */
        'projects',
        (
            SELECT COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'project_name', p.project_name,
                        'team_size', p.team_size,
                        'start_date', p.start_date,
                        'end_date', p.end_date,
                        'project_url', p.project_url,
                        'technologies_used', p.technologies_used,
                        'description', p.description
                    )
                    ORDER BY p.start_date DESC NULLS LAST
                ),
                '[]'::jsonb
            )
            FROM projects p
            WHERE p.user_id = p_user_id
        ),

        /* ---------------- CERTIFICATIONS (ORDERED DESC) ---------------- */
        'certifications',
        (
            SELECT COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'title', c.title,
                        'issuing_organization', c.issuing_organization,
                        'issue_date', c.issue_date,
                        'skills', c.skills
                    )
                    ORDER BY c.issue_date DESC NULLS LAST
                ),
                '[]'::jsonb
            )
            FROM certifications c
            WHERE c.user_id = p_user_id
        ),

        /* ---------------- TECHNICAL PARTICIPATION ---------------- */
        'technical_participation',
        COALESCE(
            (
                SELECT jsonb_agg(tp.technical_participation)
                FROM technical_participation tp
                WHERE tp.user_id = p_user_id
            ),
            '[]'::jsonb
        ),

        /* ---------------- CO CURRICULAR ---------------- */
        'co_curricular',
        COALESCE(
            (
                SELECT jsonb_agg(cc.co_curricular)
                FROM co_curricular cc
                WHERE cc.user_id = p_user_id
            ),
            '[]'::jsonb
        ),

        /* ---------------- EXTRA CURRICULAR ---------------- */
        'extra_curricular',
        COALESCE(
            (
                SELECT jsonb_agg(ec.extra_curricular)
                FROM extra_curricular ec
                WHERE ec.user_id = p_user_id
            ),
            '[]'::jsonb
        ),

        /* ---------------- ACHIEVEMENTS ---------------- */
        'achievements',
        COALESCE(
            (
                SELECT jsonb_agg(a.achievements)
                FROM achievements a
                WHERE a.user_id = p_user_id
            ),
            '[]'::jsonb
        )
    );

    RETURN resume;

END;
$$;