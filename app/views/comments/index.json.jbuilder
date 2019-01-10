json.array! @new_comments do |comment|
  json.id           comment.id
  json.content      comment.content
end
