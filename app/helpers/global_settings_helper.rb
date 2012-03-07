module GlobalSettingsHelper
  def field_for(f, k, v)
    if v.is_a?(TrueClass) || v.is_a?(FalseClass)
      f.check_box k, :checked=>v
    elsif v.is_a?(Fixnum) || v.is_a?(Float) || v.is_a?(String)
      f.text_field k, :value=>v
    elsif v.is_a?(NilClass)
      f.text_field k, :value=>".nil"
    else
      "WTF, class=#{v.class}"
    end
  end
end


