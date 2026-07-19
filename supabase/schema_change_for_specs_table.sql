drop table if exists phone_extended_specs cascade;

create table phone_extended_specs (
  id uuid primary key default gen_random_uuid(),
  phone_id uuid not null unique references phones(id) on delete cascade,

  -- Build
  build_os text,
  build_ui text,
  build_dimensions text,
  build_weight text,
  build_sim text,
  build_colors text,
  build_extra text,

  -- Frequency
  freq_2g text,
  freq_3g text,
  freq_4g text,
  freq_5g text,
  freq_extra text,

  -- Processor
  proc_cpu text,
  proc_chipset text,
  proc_gpu text,
  proc_extra text,

  -- Display
  display_technology text,
  display_size text,
  display_resolution text,
  display_protection text,
  display_extra_features text,
  display_extra text,

  -- Memory
  memory_built_in text,
  memory_card text,
  memory_extra text,

  -- Camera
  camera_main text,
  camera_features text,
  camera_front text,
  camera_extra text,

  -- Connectivity
  conn_wlan text,
  conn_bluetooth text,
  conn_gps text,
  conn_radio text,
  conn_usb text,
  conn_nfc text,
  conn_infrared text,
  conn_data text,
  conn_extra text,

  -- Features
  feat_sensors text,
  feat_audio text,
  feat_browser text,
  feat_messaging text,
  feat_games text,
  feat_torch text,
  feat_extra text,

  -- Battery
  battery_charging text,
  battery_extra text
);

create index idx_phone_extended_specs_phone on phone_extended_specs (phone_id);

alter table phone_extended_specs enable row level security;

create policy "public read phone_extended_specs" on phone_extended_specs
  for select using (true);