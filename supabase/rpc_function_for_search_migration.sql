create or replace function search_phones(search_query text, result_limit int default 20)
returns setof phones
language sql
stable
as $$
  with terms as (
    select unnest(string_to_array(trim(search_query), ' ')) as term
  )
  select p.*
  from phones p
  join brands b on b.id = p.brand_id
  where (
    select bool_and(
      (p.name || ' ' || b.name) ilike '%' || term || '%'
    )
    from terms
    where term != ''
  )
  order by
    similarity(p.name, search_query) desc,
    p.sort_order asc
  limit result_limit;
$$;