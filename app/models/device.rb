# Farmbot Device models all data related to an actual FarmBot in the real world.
class Device < ApplicationRecord
  DEFAULT_MAX_LOGS   = 100
  DEFAULT_MAX_IMAGES = 100
  TIMEZONES          = TZInfo::Timezone.all_identifiers
  BAD_TZ             = "%{value} is not a valid timezone"

  has_many  :users
  has_many  :farm_events,     dependent: :destroy
  has_many  :points,          dependent: :destroy
  has_many  :logs,            dependent: :destroy
  has_many  :sequences,       dependent: :destroy
  has_many  :regimens,        dependent: :destroy
  has_many  :peripherals,     dependent: :destroy
  has_many  :tools,           dependent: :destroy
  has_many  :images,          dependent: :destroy
  has_many  :webcam_feeds,    dependent: :destroy
  validates :timezone,     inclusion: { in: TIMEZONES,
                                        message: BAD_TZ,
                                        allow_nil: true }
  validates_presence_of :name
  [FbosConfig, FirmwareConfig, WebAppConfig].map do |klass|
    name = klass.table_name.singularize.to_sym
    has_one name, dependent: :destroy
    define_method(name) { super() || klass.create!(device: self) }
  end
  # Give the user back the amount of logs they are allowed to view.
  def limited_log_list
    logs.all.last(max_log_count || DEFAULT_MAX_LOGS)
  end

  # def auth_token
  #   SessionToken.as_json(self.users.first)[:token].encoded
  # end

  # # Send a realtime message to a logged in user.
  # def tell(message, chan = "toast")
  #   log  = Log.new({ device:     self,
  #                    message:    message,
  #                    created_at: Time.now,
  #                    channels:   [chan],
  #                    meta:       { type: "info" } })
  #   json = LogSerializer.new(log).as_json.to_json

  #   Transport.amqp_send(json, self.id, "logs")
  # end

  def self.current
    RequestStore.store[:device]
  end

  def self.current=(dev)
    RequestStore.store[:device] = dev
  end

  # Sets Device.current to `self` and returns it to the previous value when
  #  finished running block. Usually this is unecessary, but may be required in
  # background jobs. If you are not receiving auto_sync data on your client,
  # you probably need to use this method.
  def auto_sync_transaction
    prev           = Device.current
    Device.current = self
    yield
    Device.current = prev
  end

  def tz_offset_hrs
    Time.now.in_time_zone(self.timezone || "UTC").utc_offset / 1.hour
  end
end
