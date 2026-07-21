drop function if exists search_phones(text, int);

create function search_phones(search_query text, result_limit int default 20, result_offset int default 0)
returns table (id uuid, total_count bigint)
language sql
stable
as $$
  with terms as (
    select unnest(string_to_array(trim(search_query), ' ')) as term
  ),
  matched as (
    select p.id, similarity(p.name, search_query) as sim, p.sort_order
    from phones p
    join brands b on b.id = p.brand_id
    where (
      select bool_and((p.name || ' ' || b.name) ilike '%' || term || '%')
      from terms
      where term != ''
    )
  )
  select id, count(*) over() as total_count
  from matched
  order by sim desc, sort_order asc
  limit result_limit offset result_offset;
$$;