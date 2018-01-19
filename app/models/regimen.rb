# Regimens are an order checklist of "TODO" items for a bot, spread out at
# specified times after a start date.
# Examples: Water cabbage 3 times a day for 40 days, then twice a day for 20
#           days after that.
# A regimen takes a SEQUENCES and repeats them over a fixed amount of time slots
class Regimen < ApplicationRecord
  # Regimen gets pluralized strangely by Rails.
  # Occasionally to "regimans".
  # This is the workaround.
  self.table_name = "regimens"
  validates :name, presence: true
  validates :name, uniqueness: { scope: :device }
  has_many  :farm_events, as: :executable

  has_many   :regimen_items, dependent: :destroy
  belongs_to :device
  validates  :device, presence: true

  # PROBLEM:
  #  * data_update sends MQTT messages when models update.
  #  * regimen_items are a "nested resource". The user does not know they exist
  #    outside of a regimen
  #  * We still need to be notified of updates to `regimen_item`s.
  #
  # SOLUTION:
  #  * _always_ send `data_update` for Regimens, even though its kind of
  #    wasteful.
  def notable_changes?
    true
  end
end
