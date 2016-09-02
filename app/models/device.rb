# FarmbotDevice models all data related to an actual FarmBot in the real world.
# This is useful for caching things like SkyNey IDs, owner users, work logs, etc
class Device < ActiveRecord::Base

  has_many :users
  has_many :schedules, dependent: :destroy
  has_many :sequences
  has_many :regimens
  has_many :plants, dependent: :destroy
  has_one  :planting_area

  def if_not_null
    yield(self)
    self
  end

  def if_null
    self
  end
end
