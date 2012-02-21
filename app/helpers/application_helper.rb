module ApplicationHelper
  def forum_name_header(name)
    content_for :forum_name do
      h(name).html_safe
    end
  end

  def filter_format(s)
    h(s).gsub(/\n/, "<br>").html_safe
  end
end
