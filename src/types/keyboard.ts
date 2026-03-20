import { Image, Product } from "~/lib/shopify/types";

export type KeyboardSpecs = {
  display_name?: string;
  display_image?: Image;
  assigned_product?: Product;

  number_of_keys?: number;
  number_of_multifunction_keys?: number;
  layout_percentage?: string;

  switch_model?: string;
  switch_profile?: string;
  mounting_style?: string;

  hot_swappable?: boolean;
  n_key_rollover?: boolean;

  backlight_type?: string;
  backlight_modes?: number;
  led_orientation?: string;

  top_case_material?: string;
  bottom_case_material?: string;
  plate_material?: string;
  keycap_material?: string;

  working_time_lights_on?: string;
  working_time_lights_off?: string;

  connection_modes?: string;
  polling_rate?: string;
  polling_rate_wired?: string;

  max_connected_devices?: number;
  wireless_range?: string;

  type_angle?: string;
  operating_temperature?: string;
}

export type KeyboardSoundTest = {
  section_title: string;
  video_url: string;
  decibel_range?: string;
  switch_type?: string;
}