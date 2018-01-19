module Configs
  class Update < Mutations::Command
    required do
      duck :target_klass, methods: [:update_attributes!]
      duck :update_attrs, methods: [:deep_symbolize_keys]
    end

    def execute
      target_klass
        .update_attributes!(update_attrs.deep_symbolize_keys.except(:device_id))
      target_klass
    end
  end
end
