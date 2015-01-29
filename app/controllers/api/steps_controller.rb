module Api
  class StepsController < Api::AbstractController
    before_action :must_own_sequence

    def create
      mutate Steps::Create.run(params, sequence: sequence)
    end

    def show
      `espeak "get #{step.position}"`
      render json: step
    end

    def index
      render json: sequence.steps
    end

    def destroy
      if step && step.destroy
        render nothing: true
      end
    end

    def update
      `espeak "put #{params[:step][:position] || 'none'}"`
      mutate Steps::Update.run(step_params: params[:step], step: step)
    end

    private

    def sequence
      @sequence ||= Sequence.find(params[:sequence_id])
    end

    def step
      @step ||= sequence.steps.find(params[:id])
    end

    def must_own_sequence
      if sequence.user != current_user
        raise Errors::Forbidden, 'Not your Sequence object.'
      end
    end
  end
end
