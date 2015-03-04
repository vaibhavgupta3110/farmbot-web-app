module Api
  class SchedulesController < Api::AbstractController
    def index
      # Follow this for better querying in the future:
      # http://www.js-data.io/v1.3.0/docs/query-syntax
      render json: Schedule.where(user: current_user)
    end

    def create
      mutate Schedules::Create.run(params,
                                   user: current_user,
                                   sequence: sequence)
    rescue => que
      binding.pry
    end

    # def show
    #   render json: schedule
    # end

    def update
      if schedule.user != current_user
        raise Errors::Forbidden, 'Not your schedule.'
      end
      mutate Schedules::Update.run(params[:schedule],
                                   user: current_user,
                                   schedule: schedule)
    end

    def destroy
      if (schedule.user == current_user) && schedule.destroy
        render nothing: true
      else
        raise Errors::Forbidden, 'Not your schedule.'
      end
    end

    private

    def sequence
      @sequence ||= Sequence.find(params[:sequence_id])
    rescue Mongoid::Errors::InvalidFind => e
      # TODO: Proper error handler.
      raise 'You need to add a sequence_id. I need to add a better error handler'
    end

    def schedule
      @schedule ||= Schedule.find(params[:id])
    end
  end
end
