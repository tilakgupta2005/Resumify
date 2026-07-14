CREATE OR REPLACE FUNCTION get_top_projects(
    p_user_id uuid,
    p_embedding vector,
    p_limit integer DEFAULT 3
)
RETURNS jsonb
LANGUAGE sql
AS $$
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'project_name', project_name,
                'team_size', team_size,
                'start_date', start_date,
                'end_date', end_date,
                'project_url', project_url,
                'technologies_used', technologies_used,
                'description', description
            )
            ORDER BY embedding <-> p_embedding
        ),
        '[]'::jsonb
    )
    FROM (
        SELECT *
        FROM projects
        WHERE user_id = p_user_id
        ORDER BY embedding <-> p_embedding
        LIMIT p_limit
    ) p;
$$;