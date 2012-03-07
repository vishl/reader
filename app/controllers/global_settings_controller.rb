class GlobalSettingsController < ApplicationController
  before_filter :ensure_admin

  def edit
    @settings = GlobalSettings.defaults.merge(GlobalSettings.all)
  end

  def update
    @settings = GlobalSettings.defaults.merge(GlobalSettings.all)
    @settings.each do |k,v|
      GlobalSettings[k] = conv(v.class, params[:global_settings][k])
    end
    @settings = GlobalSettings.defaults.merge(GlobalSettings.all)
    render 'edit'
  end

  private
    def conv(type, val)
      if val == ".nil"
        nil
      elsif val == ".false"
        false
      elsif val == ".true"
        true
      elsif (type == TrueClass) || (type == FalseClass)
        val=="1"? true : false
      elsif type == Fixnum
        val.to_i
      elsif type == Float
        val.to_f
      else
        val
      end
    end


end


