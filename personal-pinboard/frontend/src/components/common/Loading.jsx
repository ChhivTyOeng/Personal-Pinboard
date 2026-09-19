import React from "react";
import { Loader, Text } from "@mantine/core";

export default function Loading({
  message = "Loading inspiration...",
  size = "lg",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <Loader color="brandRed" size={size} type="dots" />
      {message && (
        <Text size="sm" c="dimmed" mt="md" fw={500} className="tracking-wide">
          {message}
        </Text>
      )}
    </div>
  );
}
