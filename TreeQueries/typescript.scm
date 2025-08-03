; Capture whole declarations
(function_declaration) @chunk.function
(class_declaration) @chunk.class
(interface_declaration) @chunk.interface
(enum_declaration) @chunk.enum

; Capture names separately
(function_declaration name: (identifier) @function_name)
(class_declaration name: (type_identifier) @name)