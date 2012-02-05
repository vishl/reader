module ApplicationHelper
  def forum_name_header(name)
    content_for :forum_name do
      "<div class='forum_title'>#{h(name)}</div>".html_safe
    end
  end
end
